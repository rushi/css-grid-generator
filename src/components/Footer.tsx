const Footer = () => {
    return (
        <footer className="border-light-gray absolute bottom-0 mt-2 w-full border-t border-dotted py-4">
            <div className="mx-auto text-center">
                <p className="text-dark-gray space-x-0.75 text-sm leading-3">
                    <span>CSS Grid Generator</span>
                    <span>by</span>
                    <a
                        target="_blank"
                        href="https://github.com/rushi"
                        className="text-dark-gray hover:text-extra-dark-gray underline"
                    >
                        Rushi Vishavadia
                        {/*<!-- It wasn't Rushi, it was Skynet -->*/}
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
