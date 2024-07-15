import React from 'react';
function Footer() {
    const date = new Date();
    const year = date.getFullYear();
    return (
        <footer className="footer">
            <p>Copyright @ {year}</p>
        </footer>
    )
}
export default React.memo(Footer);