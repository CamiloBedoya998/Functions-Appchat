const showNewMessage = (chatID, cellPhoneNumber) => {
  // console.log('busca mensaje nuevo');
  let arrImgTypes = ['jpeg', 'png', 'webp', 'jpg'],
    arrVideoTypes = ['mp4'],
    arrDocsTypes = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt', 'csv'];
  let chatContainer = document.getElementById('chatContainer');
  postData(`${URL_API_CONSULTAR}/searchNewMessagesInChat`, { chatID, cellPhoneNumber, nombreDeUsuario, authToken }).then(async (res) => {
    // console.log('2',res.conversation,'  storage ',localStorage.getItem('countMessages'));
    // console.log('1',res.incomingMessages);
    if (res.conversation == localStorage.getItem('countMessages')) {
      // console.log('respuesta:',res.conversation,'countMessages:',localStorage.getItem('countMessages'));
      return;
    }
    if (res.incomingMessages && chatContainer !== null) {

      // * Agregar mensaje nuevo a la vista del chat
      let newMessage = res.incomingMessages;

      // * Validar tipo de mensaje
      // let MES_MEDIA_TYPE = newMessage.MES_MEDIA_TYPE,
      //   MES_MEDIA_URL = newMessage.MES_MEDIA_URL,
      //   MES_MESSAGE_ID = newMessage.MES_MESSAGE_ID,
      //   MES_BODY = newMessage.MES_BODY,
      //   isFileImg = false,
      //   isFileDoc = false,
      //   isFileVideo = false,
      //   isFileAudio = false;
      const MES_MEDIA_TYPE = newMessage.MES_MEDIA_TYPE;
      const MES_MEDIA_URL = newMessage.MES_MEDIA_URL;
      const MES_MESSAGE_ID = newMessage.MES_MESSAGE_ID;
      const MES_BODY = newMessage.MES_BODY;
      const MES_CHANNEL = newMessage.MES_CHANNEL;
      const MES_CREATION_DATE = newMessage.MES_CREATION_DATE;

      // console.log('MES_MEDIA_URL',MES_MEDIA_URL);
      // if (MES_MEDIA_TYPE !== null && arrImgTypes.includes(MES_MEDIA_TYPE)) isFileImg = true;
      // if (MES_MEDIA_TYPE !== null && arrDocsTypes.includes(MES_MEDIA_TYPE)) isFileDoc = true;
      // if (MES_MEDIA_TYPE !== null && arrVideoTypes.includes(MES_MEDIA_TYPE)) isFileVideo = true;
      // if (MES_MEDIA_TYPE !== null && MES_MEDIA_TYPE.includes('ogg')) isFileAudio = true;

      let tipoMsg = 'text';

      if (MES_MEDIA_TYPE !== null && arrImgTypes.includes(MES_MEDIA_TYPE)) tipoMsg = 'img';
      if (MES_MEDIA_TYPE !== null && arrDocsTypes.includes(MES_MEDIA_TYPE)) tipoMsg = 'doc';
      if (MES_MEDIA_TYPE !== null && arrVideoTypes.includes(MES_MEDIA_TYPE)) tipoMsg = 'video';
      if (MES_MEDIA_TYPE !== null && ['ogg', 'mp3'].includes(MES_MEDIA_TYPE)) tipoMsg = 'audio';


      // * el mensaje es externo y recibido al chat del agente - Burbuja blanca 
      if (newMessage.MES_CHANNEL == 'RECEIVED') {
        // chatContainer.innerHTML += `
        //   <div class="chat">
        //     <div class="chat-body">
        //       <div class="chat-text" ${MES_MEDIA_TYPE === null ? '' : isFileImg ? 'style="max-width: 250px; display: flex; flex-direction: column"' : ''}>
        //         ${MES_MEDIA_TYPE !== null && isFileImg
        //     ? <img class="imgChatReceive" src="${MES_MESSAGE_ID}.${MES_MEDIA_TYPE}" /> </br> ${MES_BODY === '' ? '' : `<p>${MES_BODY}</p>}`
        //     : MES_MEDIA_TYPE !== null && isFileDoc
        //       ? <p><a target="_blank" href="${MES_MESSAGE_ID}.${MES_MEDIA_TYPE}"=><b>File <i class="bx bx-file"></i></b></a></p>
        //       : MES_MEDIA_TYPE !== null && isFileAudio
        //         ? <audio src="${MES_MESSAGE_ID}.${MES_MEDIA_TYPE}" type="audio/mp3" controls></audio>
        //         : MES_MEDIA_TYPE !== null && isFileVideo
        //           ? <video src="${MES_MESSAGE_ID}.${MES_MEDIA_TYPE}" type="audio/mp3" controls></video>
        //           : <p>${MES_BODY}</p>
        //   }
        //       </div>
        //     </div>
        //   </div>
        //   `;

        chatContainer.innerHTML += `
          <div class="chat">
            <div class="chat-body">
              <div class="chat-text${tipoMsg === 'audio' ? 'F' : ''}" ${MES_MEDIA_TYPE === null ? '' : tipoMsg === 'img' ? 'style="max-width: 250px; display: flex; flex-direction: column"' : ''}>
                ${drawChatContent({ tipoMsg, MES_CHANNEL, MES_MESSAGE_ID, MES_MEDIA_TYPE, MES_CREATION_DATE, MES_BODY, MES_MEDIA_URL })}
              </div>
            </div>
          </div>`;
      }

      // * el mensaje es enviado por un agente - Burbuja azul
      if (newMessage.MES_CHANNEL == 'SEND') {
        // chatContainer.innerHTML += `
        //   <div class="chat chat-right">
        //     <div class="chat-body">
        //       <div class="chat-text" ${MES_MEDIA_TYPE === null ? '' : isFileImg ? 'style="max-width: 250px"' : ''}>
        //         ${MES_MEDIA_TYPE !== null && isFileImg ? <img class="imgChatSend" src="${MES_MEDIA_URL}" /> : MES_MEDIA_TYPE !== null && isFileDoc ? <p><a style="color:white" target="_blank" href="${MES_MEDIA_URL}"=><b>File <i class="bx bx-file"></i></b></a></p> : <p>${MES_BODY}</p>}
        //       </div>
        //     </div>
        //   </div>
        //   `;
        chatContainer.innerHTML += `
          <div class="chat chat-right">
            <div class="chat-body">
              <div class="chat-text" ${MES_MEDIA_TYPE === null ? '' : tipoMsg === 'img' ? 'style="max-width: 250px"' : ''}>
                ${drawChatContent({ tipoMsg, MES_CHANNEL, MES_MESSAGE_ID, MES_MEDIA_TYPE, MES_CREATION_DATE, MES_BODY, MES_MEDIA_URL })}
              </div>
            </div>
          </div>`;
      }

      // * burbuja del Administrador que interviene el chat (solo visible por el agente)
      if (newMessage.MES_CHANNEL == 'ADMIN') {
        // chatContainer.innerHTML += `
        // <div class="chat chatRecibidoAdminAgente">
        //   <div class="chat-body">
        //     <div class="chat-text">
        //       <p>${MES_BODY}</p>
        //     </div>
        //   </div>
        // </div>`;
        chatContainer.innerHTML += `
          <div class="chat chatRecibidoAdminAgente">
            <div class="chat-body">
              <div class="chat-text">
                ${drawChatContent({ tipoMsg, MES_CHANNEL, MES_MESSAGE_ID, MES_MEDIA_TYPE, MES_CREATION_DATE, MES_BODY, MES_MEDIA_URL })}
              </div>
            </div>
          </div>`;
      }

      // * Actualizacion para indicar que los chats ya fueron leidos
      let IdMessage = newMessage.PK_MES_NCODE
      let status = newMessage.MES_SMS_STATUS

      postData(`${URL_API_CONSULTAR}/updateReadIncomingMessage`, { IdMessage, status, nombreDeUsuario, authToken }).then(async (resUpdateReadMessages) => {
        // * Actualizar cantidad de mensajes en el chat
        if (resUpdateReadMessages.message == 'Actualizado') localStorage.setItem('countMessages', parseInt(localStorage.getItem('countMessages')) + 1);
      });
    }


    // * Hacer Scroll AL Chat
    // setTimeout(() => {
    //   const windowChatActual = document.querySelector('#seccionChat');
    //   if (windowChatActual) windowChatActual.scrollTo({ top: windowChatActual.scrollHeight });
    // }, 2000);

  });
};
