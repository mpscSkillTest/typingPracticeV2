import Registration from "../components/Authentication/Register/Registration";
import Login from "../components/Authentication/Login/Login";

type Props = {
  type: "login" | "signup";
};

function Authentication({ type }: Props) {
  let componentToRender = <Registration />;

  if (type === "login") {
    componentToRender = <Login />;
  }

  return (
    <div className="flex h-[inherit] w-[inherit]">
      <div className="basis-[0%] bg-[var(--primary-background-app)] md:basis-[50%]"></div>
      <div className="basis-[100%] h-full md:basis-[50%]">
        {componentToRender}
      </div>
    </div>
  );
}

export default Authentication;
