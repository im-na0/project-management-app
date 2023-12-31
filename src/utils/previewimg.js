export function setupImagePreview(imageInput, previewImage, callback) {
  imageInput.addEventListener('change', (event) => {
    handlePreviewImg(event, previewImage, (revoke) => {
      callback(event, revoke)
    })
  })
}

export function handlePreviewImg(event, previewImgEl, callback) {
  try {
    const selectedFile = event.target.files[0]

    if (!selectedFile) {
      clearPreviewImage(previewImgEl)
      throw new Error('Please select an image.')
    }

    const imageUrl = URL.createObjectURL(selectedFile)
    showPreviewImage(imageUrl, previewImgEl)

    const imageUrlInfo = {
      imageUrl,
      revokeImageUrl() {
        URL.revokeObjectURL(imageUrl)
      },
    }
    callback(imageUrlInfo)
  } catch (error) {
    console.error('Error during handlePreviewImg: ', error)
    alert(error.message)
    return null
  }
}

export function clearPreviewImage(previewImgEl) {
  previewImgEl.src = ''
  previewImgEl.classList.add('hidden')
}

export function showPreviewImage(imageUrl, previewImgEl) {
  previewImgEl.src = imageUrl
  previewImgEl.classList.remove('hidden')
}
