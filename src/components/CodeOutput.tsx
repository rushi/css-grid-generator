import { Button } from "@radix-ui/themes";
import { CheckIcon, CopyIcon } from "@xola/icons";
import { Highlight, themes } from "prism-react-renderer";
import { Tabs } from "radix-ui";
import { useState } from "react";
import { CodeLanguage, CodeOutput as CodeOutputType } from "../types/index";
import { cn } from "@/utils/classnames";

interface CodeOutputProps {
    code: CodeOutputType;
}

const CodeOutput = ({ code }: CodeOutputProps) => {
    const [copied, setCopied] = useState<CodeLanguage>();

    const handleCopy = async (language: CodeLanguage) => {
        const textToCopy = language === "html" ? code.html : language === "css" ? code.css : code.tailwind || "";
        await navigator.clipboard.writeText(textToCopy);
        setCopied(language);
        setTimeout(() => setCopied(undefined), 2000);
    };

    return (
        <Tabs.Root className={cn("flex w-full flex-col")} defaultValue="tailwind">
            <Tabs.List className="flex shrink-0">
                <Tabs.Trigger
                    value="tailwind"
                    className="hover:text-dark-blue data-[state=active]:bg-extra-light-blue data-[state=active]:text-dark-blue border-extra-light-gray data-[state=active]:border-blue flex h-10 flex-1 cursor-pointer items-center justify-center border-b bg-white px-5 text-base leading-none text-black outline-none select-none first:rounded-tl last:rounded-tr data-[state=active]:font-bold data-[state=active]:focus:relative"
                >
                    Tailwind
                </Tabs.Trigger>
                <Tabs.Trigger
                    value="css"
                    className="hover:text-dark-blue data-[state=active]:bg-extra-light-blue data-[state=active]:text-dark-blue border-extra-light-gray data-[state=active]:border-blue flex h-10 flex-1 cursor-pointer items-center justify-center border-b bg-white px-5 text-base leading-none text-black outline-none select-none first:rounded-tl last:rounded-tr data-[state=active]:font-bold data-[state=active]:focus:relative"
                >
                    CSS + HTML
                </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content
                value="css"
                className="relative grow rounded-b bg-white outline-none focus:shadow-black focus:outline-none"
            >
                <div className="space-y-0">
                    <div className="relative">
                        <h3 className="border-light-gray text-extra-dark-gray border-b px-4 pt-4 pr-16 pb-2 text-sm font-semibold">
                            CSS
                        </h3>
                        <span className="absolute top-3 right-2">
                            <Button
                                size="1"
                                variant="surface"
                                color={copied ? "green" : "blue"}
                                className={cn(copied === "css" ? "cursor-default" : "cursor-copy!")}
                                onClick={() => handleCopy("css")}
                            >
                                {copied === "css" ? <CheckIcon className="text-dark-green!" /> : <CopyIcon />}
                            </Button>
                        </span>
                        <Code code={code.css} language="css" />
                    </div>
                    <div className="relative">
                        <h3 className="border-light-gray text-extra-dark-gray border-b px-4 pt-4 pr-16 pb-2 text-sm font-semibold">
                            HTML
                        </h3>
                        <span className="absolute top-3 right-2">
                            <Button
                                size="1"
                                variant="surface"
                                color={copied ? "green" : "blue"}
                                className={cn(copied === "html" ? "cursor-default" : "cursor-copy!")}
                                onClick={() => handleCopy("html")}
                            >
                                {copied === "html" ? <CheckIcon className="text-dark-green!" /> : <CopyIcon />}
                            </Button>
                        </span>
                        <Code code={code.html} language="html" />
                    </div>
                </div>
            </Tabs.Content>
            <Tabs.Content
                value="tailwind"
                className="relative grow rounded-b bg-white outline-none focus:shadow-black focus:outline-none"
            >
                <Code code={code.tailwind || ""} language="html" />
                <span className="absolute top-4 right-2">
                    <Button
                        variant="surface"
                        color={copied ? "green" : "blue"}
                        className={cn(copied === "tailwind" ? "cursor-default" : "cursor-copy!")}
                        onClick={() => handleCopy("tailwind")}
                    >
                        {copied === "tailwind" ? <CheckIcon className="text-dark-green! stroke-2" /> : <CopyIcon />}
                    </Button>
                </span>
            </Tabs.Content>
        </Tabs.Root>
    );
};

const Code = ({ code, language }: { code: string; language: "html" | "css" }) => {
    return (
        <Highlight theme={themes.github} code={code.trim()} language={language}>
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre
                    style={style}
                    className={cn(
                        className,
                        "max-h-96 min-h-24 overflow-auto p-4 text-sm whitespace-break-spaces focus:outline-none",
                    )}
                >
                    {tokens.map((line, i) => {
                        const { key: lineKey, ...lineProps } = getLineProps({ line, key: i });
                        return (
                            <div key={i} {...lineProps}>
                                {line.map((token, key) => {
                                    const { key: tokenKey, ...tokenProps } = getTokenProps({ token, key });
                                    return <span key={key} {...tokenProps} />;
                                })}
                            </div>
                        );
                    })}
                </pre>
            )}
        </Highlight>
    );
};

export { CodeOutput };
