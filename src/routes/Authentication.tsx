import Login from "../components/Authentication/Login";

function Authentication() {
  return (
    <div className="flex h-[100vh] w-[100vw]">
      <div className="basis-[50%] bg-[var(--primary-background-app)]"></div>
      <Login />
    </div>
  );
}

export default Authentication;
