import type { Ref } from 'vue'
import type { CollectionItem } from './useCollectionMenu'

interface UseCollectionSectionOptions<T extends CollectionItem> {
  items: Ref<T[]>
  onRename: (item: T, newName: string) => Promise<void>
  onDelete: (item: T) => Promise<void>
  onRefetch: () => Promise<void>
}

export function useCollectionSection<T extends CollectionItem>(
  options: UseCollectionSectionOptions<T>,
) {
  const {
    items,
    onRename,
    onDelete,
    onRefetch,
  } = options

  const menu = useCollectionMenu<T>({
    onRename: async (item, newName) => {
      await onRename(item, newName)
      await onRefetch()
    },
    onDelete: async (item) => {
      await onDelete(item)
      await onRefetch()
    },
  })

  const computedItems = computed(() => items.value)

  return {
    items: computedItems,
    ...menu,
  }
}
