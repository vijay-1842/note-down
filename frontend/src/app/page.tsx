import { redirect, RedirectType } from "next/navigation";

const Home: React.FC = () => {
  redirect("/signin", RedirectType.replace);
  return null;
};

export default Home;
