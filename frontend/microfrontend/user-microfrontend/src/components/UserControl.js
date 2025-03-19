import React, { Children } from "react";

export default function UserControl(currentUser) {
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);

    function closeAllPopups() {
        setIsEditProfilePopupOpen(false);
        setIsEditAvatarPopupOpen(false);
    }

    function handleEditProfileClick() {
        setIsEditProfilePopupOpen(true);
    }

    function handleEditAvatarClick() {
        setIsEditAvatarPopupOpen(true);
    }

    return (
        <>
            <section className="profile page__section">
                <div className="profile__image" onClick={handleEditAvatarClick} style={imageStyle}></div>
                <div className="profile__info">
                    <h1 className="profile__title">{currentUser.name}</h1>
                    <button className="profile__edit-button" type="button" onClick={handleEditProfileClick}></button>
                    <p className="profile__description">{currentUser.about}</p>
                </div>
                {Children}
            </section>
            <EditProfilePopup
                isOpen={isEditProfilePopupOpen}
                onUpdateUser={handleUpdateUser}
                onClose={closeAllPopups}
            />
            <EditAvatarPopup
                isOpen={isEditAvatarPopupOpen}
                onUpdateAvatar={handleUpdateAvatar}
                onClose={closeAllPopups}
            />
        </>
    )
}