import Registration from "../components/Authentication/Registration";

function Authentication() {
  return (
    <div className="flex h-[inherit] w-[inherit]">
      <div className="basis-[0%] bg-[var(--primary-background-app)] md:basis-[50%]"></div>
      <div className="basis-[100%] h-full md:basis-[50%]">
        <Registration />
      </div>
    </div>
  );
}

export default Authentication;
