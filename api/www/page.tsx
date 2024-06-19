export default async function Page() {
  return (
    <main className="flex flex-col 1g:p-12">
      <div
        style={{
          display: "flex",
          marginTop: 12,
          height: "100%",
          width: "100%",
          flexDirection: "column",
          justifyContent: "center",
          fontSize: 24,
          backgroundColor: "#917289",
        }}
      >
        New board view
        <div className="flex justify-center shadow-xl sm:w-full rounded-md h-full border border-gray-100"></div>
      </div>
    </main>
  );
}
