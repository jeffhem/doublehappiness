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
    const resBtn = this.priGuestElem.querySelector('.toggle-switch');
    const menuOpt = this.priGuestElem.querySelector('.menu-option');
    // hide or show menu option and other guests
    resBtn.addEventListener('click', (e) => {
      if (e.target.checked) {
        menuOpt.classList.remove('hidden');
        this.addMore.classList.remove('hidden');
      } else {
        menuOpt.classList.add('hidden');
        this.addMore.classList.add('hidden');
        // remove all added guest if not attending
        [...document.querySelectorAll('[class^="rsvp-form-group guest-detail"]')].forEach((item) => {
          item.remove();
          this.guestNum = 1;
        });
      }
    });
  }

  addGuest() {
    this.addMore.addEventListener('click', () => {
      const funcBtnElem = this.rsvpContainer.querySelector('.func-btn');
      const tempGuestElem = this.priGuestElem.cloneNode(true);

      // rest primary guest fields to generate other guest fields
      tempGuestElem.querySelector('#attending-response').remove();
      tempGuestElem.querySelector('h2').innerHTML = `Guest ${this.guestNum} Detail`;
      tempGuestElem.querySelector('.menu-option').classList.remove('hidden');
      tempGuestElem.classList.remove('primary-guest');
      tempGuestElem.classList.add(`guest-detail-${this.guestNum}`);
      tempGuestElem.dataset.groupName = 'guest';
      const inputVal = [...tempGuestElem.querySelectorAll('input[type="text"]')];
      inputVal.forEach((item) => {
        item.value = '';
      });

      this.rsvpContainer.insertBefore(tempGuestElem, funcBtnElem);
      this.guestNum += 1;
    });
  }

  hasEmptyfield() {
    const AllInput = document.querySelectorAll('input');
    this.error = 0;
    AllInput.forEach((field) => {
      if (field.value == '') {
        field.classList.add('empty');
        this.error += 1;
      } else {
        field.classList.remove('empty');
      }
    });
    this.error ? this.error = true : this.error = false;
    return this.error;
  }

  getFormData() {
    const formGroups = document.querySelectorAll('.rsvp-form-group');
    let formData = [];
    formGroups.forEach((group) => {
      let groupData = {};
      
      groupData.type = group.dataset.groupName;

      const attend = group.querySelector('toggle-switch');
      if (attend) {
        groupData.attend = attend.check ? 'yes' : 'no';
      }

      const inputs = group.querySelectorAll('input[type="text"]');
      inputs.forEach((input) => {
        const inputName = input.dataset.nameField;
        const inputData = input.value;
        groupData[inputName] = inputData;
      })

      const selections = group.querySelectorAll('select');
      selections.forEach((selection) => {
        const selectionType = selection.dataset.menuOption;
        const selectionData = selection.options[selection.selectedIndex].value;
        groupData[selectionType] = selectionData;
      })

      formData.push(groupData);

    })

    return formData;
  }

  submitForm() {
    const submitBtn = document.querySelector('.func-btn__submit');
    submitBtn.addEventListener('click', (e) => {
      // check if primary name filled out
      if (!this.hasEmptyfield()) {
        console.log('error free');
        console.log(this.getFormData())
        this.getFormData();
      }
    })
  }
}

export default RSVP;
