console.log('works fine');

const shoppingForm = document.querySelector('.shopping');
const list = document.querySelector('.list');

// we need an array to hold our state
let items = [];

function handleSubmit(e) {
    e.preventDefault();
    console.log('submitted!');
    const name = e.currentTarget.item.value;
// if its empty than do not submit it:
    if(!name) return;
    console.log(name);

    const item = {
        name,
        id: Date.now(),
        complete: false,

    };
    // push items into our state
    items.push(item);
    console.log(`There are now ${items.length} items in your state.`)

    // clear the form
    e.currentTarget.item.value = '';
    e.target.reset();
    // displayItems(); Instead, fire-off a custom event that tells enyone else who cares that the items have just been updated
    list.dispatchEvent(new CustomEvent('itemsUpdated'));
};

function displayItems() {
 const html = items.map(item => `<li class="shopping-item">
    <input
       value="${item.id}"
       type="checkbox"
       ${item.complete ? 'checked' : ''}
     >
    <span class="itemName">
        ${item.name}
    </span>
    <button
        aria-label="Remove ${item.name}"
       value="${item.id}"
    >
        &times;
    </button>
 </li>`)
 .join('');

 list.innerHTML = html;
};

function mirrorToLocalStorage() {
    console.log('Saving to local storage');
    localStorage.setItem('items', JSON.stringify(items));
};

function restoreFromLocalStorage() {
    const lsItems = JSON.parse(localStorage.getItem('items'));
    if(lsItems.length) {
        items.push(...lsItems);
        list.dispatchEvent(new CustomEvent('itemsUpdated'));
    };
};

function deleteItem(id) {
    console.log('deleting items in progress...', id);
    // update our items array with this one
    items = items.filter(item => item.id !== id);
    list.dispatchEvent(new CustomEvent('itemsUpdated'));
    console.log(items);
};

function markAsComplete(id) {
    console.log('marking as complete', id);
    const itemReference = items.find(item => item.id === id);
    console.log(itemReference);
    itemReference.complete = !itemReference.complete;
    list.dispatchEvent(new CustomEvent('itemsUpdated'));
};

shoppingForm.addEventListener('submit', handleSubmit);
list.addEventListener('itemsUpdated', displayItems);
list.addEventListener('itemsUpdated', mirrorToLocalStorage);

// Event delegation: we listen for the click on the list <ul> but then delegate  the click over  to the button if that is what was clicked

list.addEventListener('click', function(e) {
    const id = parseInt(e.target.value);
    if(e.target.matches('button')) {
        deleteItem(id);
    }
    if(e.target.matches('input[type="checkbox"]')) {
        markAsComplete(id);
    }
});

restoreFromLocalStorage();