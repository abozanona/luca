const ModalService = {
    getModal: function (id: string) {
        return document.getElementById(id);
    },
    getModalFade: function () {
        return document.getElementsByClassName('modal--fade')[0];
    },
    openModal: function (id: string) {
        this.getModal(id).classList.toggle('modal--active');
        this.getModalFade().classList.toggle('fade--active');
    },
    closeModal: function (id: string) {
        this.getModal(id).classList.remove('modal--active');
        this.getModalFade().classList.remove('fade--active');
    },
};

export default ModalService;
