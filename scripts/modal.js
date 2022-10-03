let modalToggle = () => {
   let toggle = () => {
     modalWrapper.classList.toggle("hidden");
   };
   modalCloseBtn.addEventListener("click", () => {
     toggle();
   });
   openModalBtn.addEventListener("click", () => {
     toggle();
   });
   cancelBtn.addEventListener("click", () => {
     toggle();
   });
 };