import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";

const App = () => {
  const [jwt, setJwt] = useState('');

  const handleJwtChange = event => { // Эта функция получает нотификации о событиях изменения jwt
    setJwt(event.detail)
  }

  useEffect(() => {
    addEventListener("jwt-change", handleJwtChange); // Этот код добавляет подписку на нотификации о событиях изменения localStorage
    return () => removeEventListener("jwt-change", handleJwtChange) // Этот код удаляет подписку на нотификации о событиях изменения localStorage, когда в ней пропадает необходимость
  }, []);

  return <div className="container">
    <header className='App-header'>
        Лабораторная работа по микрофронтендам
    </header>
    <section className='App-content'>
        {jwt ? (
            <>
                <Suspense>
                  <UserControl jwt={jwt} />
                </Suspense>
                <Suspense>
                  <PlacesControl jwt={jwt} />
                </Suspense>
            </>
        ) : (
            <Suspense>
              <UserLogin/>
            </Suspense>
        )}
    </section>
  </div>
};