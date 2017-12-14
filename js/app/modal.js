$(document).ready(function(){

  const modal = $("#modal");
  const modalOverlay = $("#modal-overlay");
  const close = $("#close-btn");
  const open = $(".open-modal");


  open.click(function(){
    modal.addClass("modal-open");
    modalOverlay.addClass("overlay-open");
  });

  close.click(function(){
    modal.removeClass("modal-open");
    modalOverlay.removeClass("overlay-open");
  });

  modalOverlay.click(function(){
    modal.removeClass("modal-open");
    modalOverlay.removeClass("overlay-open");
  });
});
