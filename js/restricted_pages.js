console.log(localStorage.getItem('token'), 'token');
function restrict(){
if (localStorage.getItem('token')) {
    $('#nastavni_plan').show();
  } else {
    $('#nastavni_plan').hide();
  }
}
restrict();