const Footer = () => {
    return (
        <footer className="border-light-gray bg-extra-light-gray mt-2 border-t py-4">
            <div className="mx-auto max-w-7xl px-4 text-center">
                <p className="text-gray space-x-0.75 text-sm leading-3">
                    <span>CSS Grid Generator</span>
                    <span>by</span>
                    <a target="_blank" href="https://github.com/rushi" className="text-gray">
                        Rushi Vishavadia
                    </a>
                    <span className="ml-2">
                        Build: <span className="cursor-default font-mono text-xs">{__GIT_HASH__}</span>
                    </span>
                </p>
            </div>
        </footer>
    );
};

export { Footer };
