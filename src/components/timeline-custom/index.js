export const setTimelineCustom = function() {

  const _handleTimebutton = ({target}) => {
    $(target).closest('.time-node').toggleClass('is-active');
  }

  $('.time-button').on('click', _handleTimebutton)

}
