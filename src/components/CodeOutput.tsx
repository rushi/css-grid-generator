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
        <Tabs.Root className={cn("flex w-full flex-col")} defaultValue="tab1">
            <Tabs.List className="flex shrink-0">
                <Tabs.Trigger
                    value="tab1"
                    className="hover:text-dark-blue data-[state=active]:bg-extra-light-blue data-[state=active]:text-dark-blue border-extra-light-gray data-[state=active]:border-blue flex h-10 flex-1 cursor-pointer items-center justify-center border-b bg-white px-5 leading-none text-black outline-none select-none first:rounded-tl last:rounded-tr data-[state=active]:font-bold data-[state=active]:focus:relative"
                >
                    CSS
                </Tabs.Trigger>
                <Tabs.Trigger
                    value="tab2"
                    className="hover:text-dark-blue data-[state=active]:bg-extra-light-blue data-[state=active]:text-dark-blue border-extra-light-gray data-[state=active]:border-blue flex h-10 flex-1 cursor-pointer items-center justify-center border-b bg-white px-5 leading-none text-black outline-none select-none first:rounded-tl last:rounded-tr data-[state=active]:font-bold data-[state=active]:focus:relative"
                >
                    Tailwind
                </Tabs.Trigger>
                <Tabs.Trigger
                    value="tab3"
                    className="hover:text-dark-blue data-[state=active]:bg-extra-light-blue data-[state=active]:text-dark-blue border-extra-light-gray data-[state=active]:border-blue flex h-10 flex-1 cursor-pointer items-center justify-center border-b bg-white px-5 leading-none text-black outline-none select-none first:rounded-tl last:rounded-tr data-[state=active]:font-bold data-[state=active]:focus:relative"
                >
                    HTML
                </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content
                value="tab1"
                className="relative grow rounded-b bg-white outline-none focus:shadow-black focus:outline-none"
            >
                <Code code={code.css} language="css" />
                <span className="absolute top-4 right-4">
                    <Button
                        color="iris"
                        variant="soft"
                        className={cn(copied ? "cursor-default" : "cursor-copy!")}
                        onClick={() => handleCopy("css")}
                    >
                        {copied ? <CheckIcon className="text-dark-green! stroke-2" /> : <CopyIcon />}
                    </Button>
                </span>
            </Tabs.Content>
            <Tabs.Content
                value="tab2"
                className="relative grow rounded-b bg-white outline-none focus:shadow-black focus:outline-none"
            >
                <Code code={code.tailwind} language="css" />
                <span className="absolute top-4 right-4">
                    <Button
                        color="iris"
                        variant="soft"
                        className={cn(copied ? "cursor-default" : "cursor-copy!")}
                        onClick={() => handleCopy("tailwind")}
                    >
                        {copied ? <CheckIcon className="text-dark-green! stroke-2" /> : <CopyIcon />}
                    </Button>
                </span>
            </Tabs.Content>
            <Tabs.Content
                value="tab3"
                className="relative grow rounded-b bg-white outline-none focus:shadow-black focus:outline-none"
            >
                <Code code={code.html} language="html" />
                <span className="absolute top-4 right-4">
                    <Button
                        color="iris"
                        variant="soft"
                        className={cn(copied ? "cursor-default" : "cursor-copy!")}
                        onClick={() => handleCopy("html")}
                    >
                        {copied ? <CheckIcon color="green" /> : <CopyIcon />}
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
                    className={cn(
                        className,
                        "max-h-96 min-h-24 overflow-auto p-4 text-sm whitespace-break-spaces focus:outline-none",
                    )}
                    style={style}
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
