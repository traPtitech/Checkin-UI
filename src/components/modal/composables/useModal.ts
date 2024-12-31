import { ref } from 'vue'

export const useModal = () => {
  const shouldShowModal = ref(false)
  const openModal = () => {
    shouldShowModal.value = true
  }
  const closeModal = () => {
    shouldShowModal.value = false
  }
  const toggleModal = () => {
    if (!shouldShowModal.value) {
      openModal()
    } else {
      closeModal()
    }
  }
  return { shouldShowModal, openModal, closeModal, toggleModal }
}
