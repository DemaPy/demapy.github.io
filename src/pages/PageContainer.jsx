import { Heading } from "@/components";

const PageContainer = ({ children, title, action }) => {

  return (
    <div className="xl:py-4 xl:px-6 pt-2 px-4 w-full min-h-screen relative">
      {title && <Heading title={title} action={action} />}
      {children}
    </div>
  );
};

export default PageContainer;
