import { ReactNode } from "react";

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="debug-screens min-h-screen">
            <header className="border-light-gray border-b">
                <div className="mx-auto max-w-7xl px-4 py-4">
                    <h2>CSS Grid Generator</h2>
                    <p className="text-extra-dark-gray mt-2">
                        Create custom CSS grid layouts with drag, drop & resize. Generate code for Tailwind CSS or
                        standard CSS + HTML.
                    </p>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 pt-4">
                {children}
            </main>
        </div>
    );
};

export { Layout };
