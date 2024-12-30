import { ref } from 'vue'

export const useModal = () => {
  const shouldShowModal = ref(false)
  const openModal = () => {
    shouldShowModal.value = true
  }
  const closeModal = () => {
    shouldShowModal.value = false
  }
  const handleOpenModal = () => {
    if (!shouldShowModal.value) {
      openModal()
    } else {
      closeModal()
    }
  }
  return { shouldShowModal, openModal, closeModal, handleOpenModal }
}
