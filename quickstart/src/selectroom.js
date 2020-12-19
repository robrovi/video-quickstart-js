'use strict';

const { addUrlParams, getUrlParams } = require('./browser');
const getUserFriendlyError = require('./userfriendlyerror');

/**
 * Select your Token and Room name.
 * @param $modal - modal for selecting your Token and Room name
 * @param error - Error from the previous Room session, if any
 */
function selectRoom($modal, error) {
  const $alert = $('div.alert', $modal);
  const $changeMedia = $('button.btn-dark', $modal);
  const $roomName = $('#room-name', $modal);
  const $join = $('button.btn-primary', $modal);
  const $token = $('#token', $modal);

  // If Token is provided as a URL parameter, pre-populate the Token field.
  const { token } = getUrlParams();
  if (token) {
    $token.val(token);
  }

  // If any previously saved user name exists, pre-populate the user name field.
  const roomName = localStorage.getItem('roomName');
  if (roomName) {
    $roomName.val(roomName);
  }

  if (error) {
    $alert.html(`<h5>${error.name}${error.message
      ? `: ${error.message}`
      : ''}</h5>${getUserFriendlyError(error)}`);
    $alert.css('display', '');
  } else {
    $alert.css('display', 'none');
  }

  return new Promise(resolve => {
    $modal.on('shown.bs.modal', function onShow() {
      $modal.off('shown.bs.modal', onShow);
      $changeMedia.click(function onChangeMedia() {
        $changeMedia.off('click', onChangeMedia);
        $modal.modal('hide');
        resolve(null);
      });

      $join.click(function onJoin() {
        const roomName = $roomName.val();
        const token = $token.val();
        if (roomName && token) {
          // Append the Token to the web application URL.
          addUrlParams({ token });

          // Save the user name.
          localStorage.setItem('roomName', roomName);

          $join.off('click', onJoin);
          $modal.modal('hide');
        }
      });
    });

    $modal.on('hidden.bs.modal', function onHide() {
      $modal.off('hidden.bs.modal', onHide);
      const roomName = $roomName.val();
      const token = $token.val();
      resolve({ roomName, token });
    });

    $modal.modal({
      backdrop: 'static',
      focus: true,
      keyboard: false,
      show: true
    });
  });
}

module.exports = selectRoom;
