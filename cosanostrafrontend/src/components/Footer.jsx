import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-zinc-900 text-zinc-400 py-4 mt-8">
            <div className="container mx-auto text-center">
                <p>
                    <Link to="/barber-login" className="text-zinc-400 no-underline">&copy; {new Date().getFullYear()} Kosa Nostra. Sva prava zadržana.</Link>
                </p>
                <p>
                    Zapratite nas <a href="#" className="text-zinc-200">Instagram</a> | <a href="#" className="text-zinc-200">Facebook</a>
                </p>
                <p>
                    Veb sajt dizajnirao i razvio <a href="https://www.github.com/darkomihic" target="_blank" rel="noopener noreferrer" className="text-zinc-200">Darko Mihić</a>.
                </p>
            </div>
        </footer>
    );
}
