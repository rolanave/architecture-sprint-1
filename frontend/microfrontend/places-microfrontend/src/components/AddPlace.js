import React from "react";

export default function AddPlace(currentUser) {
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);

    function handleAddPlaceClick() {
        setIsAddPlacePopupOpen(true);
    }

    function closeAllPopups() {
        setIsAddPlacePopupOpen(false);
    }

    function handleAddPlaceSubmit(newCard) {
        api
            .addCard(newCard)
            .then((newCardFull) => {
                setCards([newCardFull, ...cards]);
                closeAllPopups();
            })
            .catch((err) => console.log(err));
    }

    function onAddPlace() {

    }

    return (
        <>
            <button className="profile__add-button" type="button" onClick={handleAddPlaceClick}></button>
            <AddPlacePopup
                isOpen={isAddPlacePopupOpen}
                onAddPlace={handleAddPlaceSubmit}
                onClose={closeAllPopups}
            />
        </>
    );
}