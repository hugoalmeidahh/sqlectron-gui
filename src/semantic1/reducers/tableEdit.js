export const SHOW_EDIT = 'SHOW_EDIT';
export const HIDE_EDIT = 'HIDE_EDIT';
const INITIAL_STATE = {
  show_edit: false,
  database:"",
  item:"",
};


export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case SHOW_EDIT: {
      return {
        	...state,
        	show_edit:true,
        	database:action.database,
        	item:action.item,
      }
    }
    case HIDE_EDIT: {
      return {
        	...state,
        	show_edit:false,
      }
    }
    default : return state;
  }
}
