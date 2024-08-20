import loading from "../assets/loading.gif";

export default function Loading() {
  return (
    <div className="flex flex-row justify-center items-center">
      <img height={100} width={100} src={loading} />
    </div>
  );
}
