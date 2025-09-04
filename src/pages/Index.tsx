import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { TheorySection } from "@/components/sections/TheorySection";
import { SetupSection } from "@/components/sections/SetupSection";
import { CrudSection } from "@/components/sections/CrudSection";
import { AdvancedSection } from "@/components/sections/AdvancedSection";
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  const [activeSection, setActiveSection] = useState("theory");

  const renderContent = () => {
    switch (activeSection) {
      case "theory":
        return <TheorySection />;
      case "setup":
        return <SetupSection />;
      case "crud":
        return <CrudSection />;
      case "advanced":
        return <AdvancedSection />;
      default:
        return <TheorySection />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
      
      <Toaster />
    </div>
  );
};

export default Index;
