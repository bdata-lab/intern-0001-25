import React from 'react';

const Home = () => {
    return (
        <div>
            <h1>Home</h1>
            <button style={{ backgroundColor: "red", color: "white", border: "1px solid black"}} onClick={() => window.location.href = "/books"}>Books</button>
            <button style={{ backgroundColor: "green", color: "white", border: "1px solid black"}} onClick={() => window.location.href = "/cars"}>Cars</button>
        </div>
    );
}

export default Home;