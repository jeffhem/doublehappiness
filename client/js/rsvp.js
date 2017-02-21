import util from './util';

class RSVP {
  constructor() {
    this.rsvpContainer = document.querySelector('.rsvp-form-container');
    this.priGuestElem = document.querySelector('.rsvp-form-group.primary-guest');
    this.addMore = this.rsvpContainer.querySelector('.func-btn__add-more');
    this.guestNum = 1;
    this.init();
  }

  init() {
    this.attendanding();
    this.addGuest();
    this.submitForm();
  }

  attendanding() {
    const respBtn = [...this.priGuestElem.querySelectorAll('.attend-btn')];
    const hiddenRows = [...document.querySelectorAll('.row--hidden')];
    // hide or show menu option and other guests
    respBtn.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        if (e.target.checked) {
          console.log(e.target.dataset);
          if (e.target.dataset.resp === 'accept') {
            hiddenRows.forEach((row) => {
              row.classList.remove('hidden');
            })
            this.addMore.classList.remove('hidden');
          } else if (e.target.dataset.resp === 'reject') {
            hiddenRows.forEach((row) => {
              row.classList.add('hidden');
            })
            this.addMore.classList.add('hidden');
            // remove all added guest if not attending
            [...document.querySelectorAll('[class^="rsvp-form-group additional-guest"]')].forEach((item) => {
              item.remove();
              this.guestNum = 1;
            });
          }
        }
      });
    });
  }

  addGuest() {
    this.addMore.addEventListener('click', () => {
      const additoinalBtnElem = this.rsvpContainer.querySelector('.row__guest--btn');
      const tempGuestElem = this.priGuestElem.cloneNode(true);
      // rest primary guest fields to generate other guest fields
      tempGuestElem.querySelector('.row__attending').remove();
      tempGuestElem.querySelector('.row__kids').remove();
      tempGuestElem.querySelector('h3.guest-title').innerHTML = 'Additoinal guest details';
      tempGuestElem.classList.remove('primary-guest');
      tempGuestElem.classList.add('additional-guest');
      tempGuestElem.dataset.groupName = 'guest';
      const inputVal = [...tempGuestElem.querySelectorAll('input[type="text"]')];
      inputVal.forEach((item) => {
        item.value = '';
      });
      const radioInput = [...tempGuestElem.querySelectorAll('input[type="radio"]')];
      radioInput.forEach((input) => {
        input.name += `-guest-${this.guestNum}`;
        input.id += `-guest-${this.guestNum}`;
        input.className += `-guest-${this.guestNum}`;
        input.checked = false;
      });
      const radioInputLabel = [...tempGuestElem.querySelectorAll('label')];
      radioInputLabel.forEach((label) => {
        const oldVal = label.getAttribute('for');
        label.setAttribute('for', `${oldVal}-guest-${this.guestNum}`);
      });

      // insert remove btn
      const removeBtn = '<span class="remove-btn">&#x2715;</span>';
      tempGuestElem.querySelector('h3.guest-title').insertAdjacentHTML('afterend', removeBtn);
      this.removeBtnAction(tempGuestElem);

      this.rsvpContainer.insertBefore(tempGuestElem, additoinalBtnElem);
      this.guestNum++;
    });
  }

  removeBtnAction(container) {
    const removeBtn = container.querySelector('.remove-btn');
    removeBtn.addEventListener('click', () => {
      container.remove();
    });
  }

  hasEmptyfield() {
    // check required text fields
    const allTextInput = document.querySelectorAll('input:not([type="radio"])');
    this.error = 0;
    allTextInput.forEach((field) => {
      if (field.value === '' && field.hasAttribute('required')) {
        field.closest('.rsvp-form-row').classList.add('empty');
        this.error += 1;
      } else {
        field.closest('.rsvp-form-row').classList.remove('empty');
      }
    });

    // check required radio fields
    const allRadioInput = document.querySelectorAll('input[type="radio"]');
    let radioClass = '';
    let groupChecked = false;
    let reset = true;

    for (let i = 0; i < allRadioInput.length; i++) {
      if (reset) {
        radioClass = allRadioInput[i].className;
        reset = false;
        groupChecked = false;
      }
      if ((allRadioInput[(i + 1)] && allRadioInput[(i + 1)].className !== radioClass) || i + 1 === allRadioInput.length) {
        reset = true;
        if (!allRadioInput[i].checked) {
          !groupChecked ? allRadioInput[i].closest('.rsvp-form-row').classList.add('empty') : '';
        }
      } else if (allRadioInput[i].checked) {
        groupChecked = true;
        allRadioInput[i].closest('.rsvp-form-row').classList.remove('empty');
      }
    }

    this.error ? this.error = true : this.error = false;
    return this.error;
  }

  getFormData() {
    const formGroups = document.querySelectorAll('.rsvp-form-group');
    let formData = [];
    formGroups.forEach((group) => {
      let groupData = {};
      
      groupData.type = group.dataset.groupName;

      const attend = group.querySelector('.toggle-switch');
      if (attend) {
        groupData.attend = attend.checked ? 'yes' : 'no';
      }

      const inputs = group.querySelectorAll('input[type="text"]');
      inputs.forEach((input) => {
        const inputName = input.dataset.nameField;
        const inputData = input.value;
        groupData[inputName] = inputData;
      });

      const selections = group.querySelectorAll('select');
      selections.forEach((selection) => {
        const selectionType = selection.dataset.menuOption;
        const selectionData = selection.options[selection.selectedIndex].value;
        groupData[selectionType] = selectionData;
      });

      formData.push(groupData);

    });

    return formData;
  }

  submitForm() {
    const submitBtn = document.querySelector('.func-btn__submit');
    const submitMsg = document.querySelector('.submit-msg');
    const formContent = document.querySelector('.rsvp-form-container');
    submitBtn.addEventListener('click', (e) => {
      // check if primary name filled out
      if (!this.hasEmptyfield()) {
        // console.log('error free');
        // console.log(this.getFormData())
        formContent.style.display = 'none';
        const formData = this.getFormData();
        util.xhrPost('api/rsvp', formData, (data) => {
          // console.log(data);
          submitMsg.innerHTML = `<h2>Thank you for your RSVP, ${data.firstName}!!</h2>`;
          if (data.attendanding == 'yes') {
            submitMsg.innerHTML =  '<p>Looking forward to seeing you on May 13!</p>';
          } else {
            submitMsg.innerHTML = '<p>We\'re sorry you can\'t make it, feel free to let us know anytime if your plan changed!</p>';
          }
        }, (error) => {
          // console.log(error);
          // console.warn(`error: ${error}`);
          if (error.status === '409') {
            submitMsg.innerHTML = `${error.body.guest_first_name}, Looks like you already registered before, please let Tianyu or Jeff know if your plan has changed.`
          }
        })
      }
    })
  }
}

export default RSVP;
