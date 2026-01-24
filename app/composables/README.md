# Collection Management Composables

Reusable composables do zarządzania kolekcjami (Chats, Boards, Notes i inne) z obsługą kontekstowego menu, dialogów rename/delete.

## Composables

### `useCollectionMenu`

Obsługuje logikę menu kontekstowego, rename i delete dla dowolnej kolekcji.

**Parametry:**
```typescript
interface UseCollectionMenuOptions<T extends CollectionItem> {
  onRename: (item: T, newName: string) => Promise<void>
  onDelete: (item: T) => Promise<void>
}
```

**Zwracane wartości:**
- `menuVisible` - Ref<boolean> - widoczność menu
- `menuActivator` - Ref<Element | undefined> - element activator menu
- `selectedItem` - Ref<T | null> - aktualnie wybrany element
- `renameDialogVisible` - Ref<boolean> - widoczność dialog rename
- `deleteDialogVisible` - Ref<boolean> - widoczność dialog delete
- `isLoading` - Ref<boolean> - loading state
- `showContextMenu(event, item)` - pokaż menu na prawy click
- `openRenameDialog()` - otwórz dialog rename
- `openDeleteDialog()` - otwórz dialog delete
- `handleRenameConfirm(newName)` - obsłuż rename (automatycznie refetchuje dane)
- `handleDeleteConfirm()` - obsłuż delete (automatycznie refetchuje dane)

**Przykład użycia:**
```typescript
const chatSection = useCollectionMenu({
  onRename: (chat, newName) => chatStore.updateChat(chat.id, newName),
  onDelete: (chat) => chatStore.deleteChat(chat.id),
})

// W template:
// @contextmenu.prevent="chatSection.showContextMenu($event, chat)"
// v-model="chatSection.renameDialogVisible"
```

### `useCollectionSection`

Composable wyższego poziomu, łączy `useCollectionMenu` z logiką refetchowania danych. Idealne do użycia w nawigacji.

**Parametry:**
```typescript
interface UseCollectionSectionOptions<T extends CollectionItem> {
  items: Ref<T[]>
  onRename: (item: T, newName: string) => Promise<void>
  onDelete: (item: T) => Promise<void>
  onRefetch: () => Promise<void>
}
```

**Zwracane wartości:** Wszystko z `useCollectionMenu` + computed `items`.

**Przykład użycia (NavigationDrawer):**
```typescript
const chatSection = useCollectionSection({
  items: chats, // Ref<Chat[]> from storeToRefs
  onRename: (chat, newName) => chatStore.updateChat(chat.id, newName),
  onDelete: (chat) => chatStore.deleteChat(chat.id),
  onRefetch: () => chatStore.fetchTeamChats(teamId),
})
```

## Komponenty

### `TeamCreateDialog`

Dialog do tworzenia nowych elementów w kolekcji.

**Props:**
- `type: 'chat' | 'board' | 'notes'` - typ kolekcji
- `teamId: string` - ID zespołu
- `onConfirm?: (name: string) => Promise<void>` - opcjonalny callback do obsługi tworzenia

**Domyślne zachowanie:**
- `type="chat"` - wywołuje `chatStore.addChat()`
- `type="board"` - wywołuje `boardStore.addBoard()`

**Niestandardowe użycie:**
```vue
<TeamCreateDialog
  v-model="dialogVisible"
  type="board"
  :team-id="teamId"
  :on-confirm="async (name) => {
    await customCreateLogic(name)
  }"
/>
```

### `RenameDialog`

Dialog do zmiany nazwy elementu.

**Props:**
- `modelValue: boolean` - widoczność dialogu
- `object?: string` - nazwa obiektu (np. "Chat", "Board")
- `objectName?: string` - aktualną nazwę obiektu
- `loading?: boolean` - loading state

**Events:**
- `@update:model-value` - zmiana widoczności
- `@confirm` - potwierdzenie rename z nową nazwą

**Użycie z composable:**
```vue
<RenameDialog
  :model-value="unref(section.renameDialogVisible)"
  :object-name="unref(section.selectedItem)?.name"
  object="Chat"
  :loading="unref(section.isLoading)"
  @update:model-value="(v) => { section.renameDialogVisible.value = v }"
  @confirm="section.handleRenameConfirm"
/>
```

### `UserSelect`

Reusable komponent do wyboru użytkowników z opcjonalnym filtrowaniem do członków zespołu.

**Props:**
- `label?: string` - etykieta (default: "Select Users")
- `selectedIds?: string[]` - preselektowane ID użytkowników
- `multiple?: boolean` - czy można wybrać wielu użytkowników (default: true)
- `teamId?: string` - opcjonalny ID zespołu do filtrowania tylko do jego członków

**Model:**
- `v-model` - Ref<User | User[]> - wybrany użytkownik(cy)
  - Jeśli `multiple=true` - zwraca `User[]`
  - Jeśli `multiple=false` - zwraca `User` lub pusty object

**Użycie do przypisania do Taska:**
```vue
<!-- Wybierz członków teamu do przypisania -->
<UserSelect
  v-model="taskAssignees"
  label="Assign to..."
  :team-id="teamId"
  multiple
/>
```

**Użycie do wyboru pojedynczego użytkownika:**
```vue
<!-- Wybierz pojedynczego kreatora taska -->
<UserSelect
  v-model="taskCreator"
  label="Created by"
  :team-id="teamId"
  :multiple="false"
/>
```

**Użycie bez filtrowania (wszystkich użytkowników):**
```vue
<!-- Wszyscy użytkownicy, bez ograniczeń do zespołu -->
<UserSelect
  v-model="selectedUsers"
  label="Select users"
/>
```

## Jak dodać nową kolekcję (np. Notes)

1. **Store** (notes.ts):
   - Zaimplementuj `addNote()`, `fetchTeamNotes()`, `updateNote()`, `deleteNote()`
   - Zrób to analógicznie do `chatStore`

2. **NavigationDrawer** (lub nowy komponent sekcji):
   ```typescript
   const noteStore = useNoteStore()
   const { notes } = storeToRefs(noteStore)
   
   const notesSection = useCollectionSection({
     items: notes,
     onRename: (note, newName) => noteStore.updateNote(note.id, newName),
     onDelete: (note) => noteStore.deleteNote(note.id),
     onRefetch: () => noteStore.fetchTeamNotes(teamId),
   })
   ```

3. **Template:**
   ```vue
   <!-- Sekcja Notes -->
   <div class="flex w-full justify-between">
     <v-list-subheader>Notes</v-list-subheader>
     <v-btn
       icon
       size="small"
       variant="plain"
       @click="noteDialogVisible = true"
     >
       <v-icon>mdi-plus</v-icon>
     </v-btn>
   </div>
   
   <v-list-item
     v-for="note in unref(notesSection.items)"
     :key="note.id"
     :to="`/team/${team.id}/notes/${note.id}`"
     @contextmenu.prevent="notesSection.showContextMenu($event, note)"
   >
     <span class="font-black"># </span>
     <span>{{ note.name }}</span>
   </v-list-item>
   
   <!-- Menu, dialogi... (analogicznie do Chats/Boards) -->
   ```

4. **Dialog do tworzenia:**
   ```vue
   <TeamCreateDialog
     v-model="noteDialogVisible"
     type="notes"
     :team-id="team.id"
   />
   ```

## Architektura

```
useCollectionMenu (niskopoziomowy)
        ↓
        ├─→ menuVisible, selectedItem, dialogs
        ├─→ showContextMenu(), openRenameDialog(), openDeleteDialog()
        └─→ handleRenameConfirm(), handleDeleteConfirm()

useCollectionSection (wysokopoziomowy)
        ↓
        ├─→ wraps useCollectionMenu
        ├─→ dodaje logikę refetchowania
        └─→ zwraca computed items
```

Dzięki tej architekturze:
- ✅ DRY - brak duplikacji logiki
- ✅ Reusable - łatwo dodać nowe kolekcje
- ✅ Type-safe - pełny TypeScript support
- ✅ Testowalne - logika w composables, template clean
