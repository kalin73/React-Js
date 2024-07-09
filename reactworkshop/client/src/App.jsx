import './styles.css'
import Header from "./components/header/Header.jsx";
import Footer from "./components/footer/Footer.jsx";
import UserSection from "./components/user-section/UserSection.jsx";

function App() {

    return (
        <>
            <Header/>
            <main className="main">
                <UserSection/>
            </main>
            <Footer/>
        </>
    )
}

export default App
