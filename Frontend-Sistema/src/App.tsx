import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen pt-24">
        <h1 className="text-center text-4xl mt-20">
          Home Temporal
        </h1>
      </main>

      <Footer />
    </>
  );
}

export default App;