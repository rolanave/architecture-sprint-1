import React from 'react';
import { PopupWithForm } from 'mesto-common-comp';

function EditAvatarPopup({ isOpen, onClose }) {
  const inputRef = React.useRef();
  
  function onUpdateAvatar(avatarUpdate) {
        api
         .setUserAvatar(avatarUpdate)
         .then((newUserData) => {
           setCurrentUser(newUserData);
           closeAllPopups();
         })
  }

  function handleSubmit(e) {
    e.preventDefault();

    onUpdateAvatar({
      avatar: inputRef.current.value,
    });
  }

  return (
    <PopupWithForm
      isOpen={isOpen} onSubmit={handleSubmit} onClose={onClose} title="Обновить аватар" name="edit-avatar"
    >

      <label className="popup__label">
        <input type="url" name="avatar" id="owner-avatar"
               className="popup__input popup__input_type_description" placeholder="Ссылка на изображение"
               required ref={inputRef} />
        <span className="popup__error" id="owner-avatar-error"></span>
      </label>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;
