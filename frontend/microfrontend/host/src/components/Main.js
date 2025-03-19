import React, { Suspense } from 'react';
import { lazy } from "react-router-dom";
import { CurrentUserContext } from 'CurrentUserContext';

const UserControl = lazy(() => import('user-microfrontend/UserControl').catch(() => {
  return { default: () => <div className='error'>Component is not available!</div> };
})
);
const AddPlace = lazy(() => import('places-microfrontend/AddPlace').catch(() => {
  return { default: () => <div className='error'>Component is not available!</div> };
})
);
const PlacesControl = lazy(() => import('places-microfrontend/PlacesControl').catch(() => {
  return { default: () => <div className='error'>Component is not available!</div> };
})
);

function Main() {
  const currentUser = React.useContext(CurrentUserContext);

  const imageStyle = { backgroundImage: `url(${currentUser.avatar})` };

  return (
    <main className="content">
      <Suspense>
        <UserControl currentUser={currentUser}>
          <Suspense>
            <AddPlace currentUser={currentUser} />
          </Suspense>
        </UserControl>
      </Suspense>
      <Suspense>
        <PlacesControl currentUser={currentUser} />
      </Suspense>
    </main>
  );
}

export default Main;
