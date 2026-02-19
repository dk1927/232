import HeroSection from "@/components/home/HeroSection";
import TechStack from "@/components/home/TechStack";
import ProjectList from "@/components/home/ProjectList";
import ContactForm from "@/components/home/ContactForm";

export default function Home() {
    return (
        <>
            <HeroSection />
            <TechStack />
            <ProjectList />
            <ContactForm />
        </>
    );
}
