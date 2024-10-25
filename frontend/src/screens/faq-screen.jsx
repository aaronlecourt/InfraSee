import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import questions from "@/utils/faqData";

const FAQScreen = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSelect = (value) => {
    setSelectedQuestion(value);
    setOpen(false);
  };

  const selectedAnswer = questions.find(
    (q) => q.question === selectedQuestion
  )?.answer;

  // Filter questions based on the search term
  const filteredQuestions = questions.filter((item) =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <HelmetProvider>
      <Helmet>
        <title>{"InfraSee | FAQ"}</title>
      </Helmet>
      <header className="w-full h-fit p-3 flex items-center justify-between border-b border-slate-400 bg-white sticky top-0 z-20">
        <div
          className="w-[6rem] mt-1 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src="/infrasee_black.png" alt="Infrasee Logomark" />
        </div>
        <nav className="flex">
          <Button onClick={() => navigate("/contact-us")} variant="ghost">
            Contact Us
          </Button>
          <Button onClick={() => navigate("/report")}>Make a Report</Button>
        </nav>
      </header>

      <div className="flex min-h-[90vh] flex-col gap-2 p-5">
        <div className="mb-2">
          <h2 className="text-xl font-bold mb-2">Frequently Asked Questions</h2>
          <p className="text-sm text-muted-foreground">
            Explore InfraSee and uncover answers to your questions.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between text-left overflow-hidden whitespace-nowrap text-ellipsis"
              >
                {selectedQuestion
                  ? questions.find((q) => q.question === selectedQuestion)
                      ?.question
                  : "Select a question..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 max-w-sm">
              <Command>
                <CommandInput
                  placeholder="Search questions..."
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <CommandList>
                  {filteredQuestions.length === 0 ? (
                    <CommandEmpty>No results.</CommandEmpty>
                  ) : (
                    <CommandGroup>
                      {filteredQuestions.map((item) => (
                        <CommandItem
                          key={item.question}
                          value={item.question}
                          onSelect={handleSelect}
                        >
                          {item.question}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {selectedAnswer && (
            <div className="bg-muted/50 rounded-md border p-3 w-full overflow-auto text-sm text-muted-foreground">
              {selectedAnswer}
            </div>
          )}
        </div>
      </div>
    </HelmetProvider>
  );
};

export default FAQScreen;
