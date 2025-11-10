import kalennerLogo from "@/assets/kalenner-logo.png";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary py-12 flex items-center justify-center">
        <img src={kalennerLogo} alt="Kalenner" className="h-32 w-auto" />
      </header>
      <main className="flex-1 flex items-center justify-center p-8">
        {children}
      </main>
    </div>
  );
};

export default AuthLayout;
