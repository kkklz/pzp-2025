export interface CollectionItem {
  id: string
  name: string
}

interface UseCollectionMenuOptions<T extends CollectionItem> {
  onRename: (item: T, newName: string) => Promise<void>
  onDelete: (item: T) => Promise<void>
}

export function useCollectionMenu<T extends CollectionItem>(
  options: UseCollectionMenuOptions<T>,
) {
  const menuVisible = ref(false)
  const menuActivator = ref<Element | undefined>(undefined)
  const selectedItem = ref<T | null>(null)

  const renameDialogVisible = ref(false)
  const deleteDialogVisible = ref(false)
  const isLoading = ref(false)

  function showContextMenu(event: MouseEvent, item: T) {
    event.preventDefault()
    selectedItem.value = item
    menuVisible.value = true
    menuActivator.value = event.target as Element
  }

  function openRenameDialog() {
    renameDialogVisible.value = true
    menuVisible.value = false
  }

  function openDeleteDialog() {
    deleteDialogVisible.value = true
    menuVisible.value = false
  }

  async function handleRenameConfirm(newName: string) {
    if (!selectedItem.value)
      return

    isLoading.value = true
    try {
      await options.onRename(selectedItem.value, newName)
      renameDialogVisible.value = false
    }
    finally {
      isLoading.value = false
    }
  }

  async function handleDeleteConfirm() {
    if (!selectedItem.value)
      return

    isLoading.value = true
    try {
      await options.onDelete(selectedItem.value)
      deleteDialogVisible.value = false
    }
    finally {
      isLoading.value = false
    }
  }

  function reset() {
    menuVisible.value = false
    menuActivator.value = undefined
    selectedItem.value = null
    renameDialogVisible.value = false
    deleteDialogVisible.value = false
    isLoading.value = false
  }

  return {
    menuVisible,
    menuActivator,
    selectedItem,
    renameDialogVisible,
    deleteDialogVisible,
    isLoading,
    showContextMenu,
    openRenameDialog,
    openDeleteDialog,
    handleRenameConfirm,
    handleDeleteConfirm,
    reset,
  }
}
