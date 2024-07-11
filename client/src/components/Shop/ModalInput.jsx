const ModalInput = ({onChangeP, valueP, valueC, onChangeC, mode, coins}) => {
  return (
    <div className="">
      <div className="flex flex-col gap-[10px]  ">
        <input
          className={`${
            mode !== "delete" ? "border-1" : null
          }   italic font-[12px] px-[5px]  py-[5px] `}
          placeholder="promise"
          value={valueP}
          onChange={onChangeP}
          disabled={mode === "delete" || mode === "update" ? true : false}
        />
        {/* {mode == "update" ? <input value={coins} onChange={onChangeC} /> : null} */}

        {mode === "new" || mode == "update" ? (
          <input
            className="  border-1
                      italic font-[12px] px-[5px] self-center max-w-[50px] p-[2px] "
            placeholder="coins"
            value={mode == "update" ? coins : valueC}
            onChange={onChangeC}
            // disabled={mode === "update" ? true : false}
          />
        ) : null}
      </div>
      {mode === "delete" ? (
        <p>Are you sure you want to delete this promise ?</p>
      ) : null}{" "}
      <form method="dialog" className="modal-backdrop"></form>
    </div>
  );
};
export default ModalInput;
