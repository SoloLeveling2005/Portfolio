import './App.css';
import './assets/css/bootstrap.css'
import {useState, useEffect, useRef} from "react";
import {Link, Navigate, useNavigate} from "react-router-dom";
import axios from "axios";
import {render} from "@testing-library/react";
function App() {
    // Прокрутка

    const targetElementRef = useRef();
    const targetElementRefElem = useRef();

    const scrollToElement = () => {
        console.log(targetElementRef.current)
        if (targetElementRef.current) {
            console.log(targetElementRefElem.current.getBoundingClientRect().bottom)
            const topPosition = targetElementRefElem.current.offsetTop;
            const bottomPosition = topPosition + targetElementRefElem.current.offsetHeight;
            targetElementRef.current.scroll({
                // top: targetElementRefElem.current.getBoundingClientRect().bottom,
                behavior: 'smooth',
                top: bottomPosition
            });
        }
    };



    // Данные
    const navigate = useNavigate();

    const [firstStart, setFirstStart] = useState(true);
    const [userInfo, setUserInfo] = useState({login:""});

    const [newMessage, setNewMessage] = useState('');

    const [messageContextMenuX, setMessageContextMenuX] = useState(0);
    const [messageContextMenuY, setMessageContextMenuY] = useState(0);

    const [socketO, setSocket] = useState(Object);
    const [chats, setChats] = useState([]);
    const [chatsSearch, setChatsSearch] = useState([]);
    const [chatsSearchBool, setChatsSearchBool] = useState(false);
    const [activeChat, setActiveChat] = useState({});
    const [activeChatInfo, setActiveChatInfo] = useState({});
    const [activeChatMessages, setActiveChatMessages] = useState([]);
    const [activeChatAutoresponder, setActiveChatAutoresponder] = useState(false);
    let allMessages = []

    const [businessUserInfo, setBusinessUserInfo] = useState({});
    const [businessUserInfoStatus, setBusinessUserInfoStatus] = useState(false);

    const FSetMessageContextMenu = (event) => {
        event.preventDefault()
        setMessageContextMenuX(event.clientX)
        setMessageContextMenuY(event.clientY)
    }
    const FSetMyMessageContextMenu = (event) => {
        event.preventDefault()
        setMessageContextMenuX(event.clientX-180)
        setMessageContextMenuY(event.clientY)
    }

    useEffect(() => {
        scrollToElement()
    }, [activeChatMessages]);

    // const navigate = useNavigate();
    if (!localStorage.getItem('token')) {
        return <Navigate to={`auth`} />;
    }



    const searchChat = (find_prompt) => {
        setChatsSearchBool(false)
        find_prompt = find_prompt.trim()
        if (find_prompt === '') return;
        setChatsSearchBool(true)
        axios.post('http://127.0.0.1:8000/api/chat/search', {
            'find_prompt':find_prompt,
        }, {
            headers:{
                Authorization:`Token ${localStorage.getItem('token')}`
            }
        }).then((response)=>{
            if (response.status === 200) {
                setChatsSearch(response.data)
            }
        }).catch((error)=>{
            console.log(error)
            if (error.response.status === 401) {
                localStorage.removeItem('token')
                navigate('/auth')
            }
        })
    }

    const getMyInfo = () => {
        axios.get('http://127.0.0.1:8000/api/user/info', {
            headers:{
                Authorization:`Token ${localStorage.getItem('token')}`
            }
        }).then((response)=>{
            if (response.status === 200) {
                setUserInfo(response.data)
            }
        }).catch((error)=>{
            console.log(error)
            if (error.response.status === 401) {
                localStorage.removeItem('token')
                navigate('/auth')
            }
        })
    }

    const getChatInfo = (room_slug) => {
        return axios.post('http://127.0.0.1:8000/api/chat/room', {
           'room_slug':room_slug
        }, {
            headers:{
                Authorization:`Token ${localStorage.getItem('token')}`
            }
        }).then((response)=>{
            if (response.status === 200) {
                setActiveChatInfo(response.data)

                if (response.data.user_1.login === userInfo.login) {
                    setActiveChatAutoresponder(response.data.user_1_autoresponder)
                }
                if (response.data.user_2.login === userInfo.login) {
                    setActiveChatAutoresponder(response.data.user_2_autoresponder)
                }
            }
        }).catch((error)=>{})
    }

    const getMyChats = () => {
        axios.get('http://127.0.0.1:8000/api/chat/chat', {
            headers:{
                Authorization:`Token ${localStorage.getItem('token')}`
            }
        }).then((response)=>{
            if (response.status === 200) {
                setChats(response.data)
            }
        }).catch((error)=>{
            console.log(error)
            if (error.response.status === 401) {
                localStorage.removeItem('token')
                navigate('/auth')
            }
        })
    }

    const getBusinessInfo = () => {
        axios.get('http://127.0.0.1:8000/api/user/businessUser', {
            headers:{
                Authorization:`Token ${localStorage.getItem('token')}`
            }
        }).then((response)=>{
            if (response.status === 200) {
                setBusinessUserInfo(response.data)
                setBusinessUserInfoStatus(true)
            }
            if (response.status === 204) {
                setBusinessUserInfo({})
                setBusinessUserInfoStatus(false)

            }
        }).catch((error)=>{
            console.log(error)
            if (error.response.status === 401) {
                localStorage.removeItem('token')
                navigate('/auth')
            }
        })
    }

    const getChatMessages = (chat) => {
        axios.post('http://127.0.0.1:8000/api/chat/messages', {
            'room_slug':chat.room_slug
        },{
            headers:{
                Authorization:`Token ${localStorage.getItem('token')}`
            }
        }).then((response)=>{
            if (response.status === 200) {
                setActiveChatMessages(response.data)
            }
        }).catch((error)=>{
            console.log(error)
            if (error.response.status === 401) {
                localStorage.removeItem('token')
                navigate('/auth')
            }
        })
    }

    const createChatRoom =  async (chat) => {
        return await axios.post('http://127.0.0.1:8000/api/chat/chat', {
            'login':chat.login
        }, {
            headers:{
                Authorization:`Token ${localStorage.getItem('token')}`
            }
        }).then((response)=>{
            if (response.status === 201) {
                chat.room_slug = response.data.slug
                return chat
            }
        }).catch((error)=>{
            if (error.response.status === 409) {
                chat.room_slug = error.response.data.slug
                return chat
            }
        })
    }

    const closeChatConnect = () => {
        try{
            socketO.close()
        } catch (error) {
        }
    }

    const updateMessages = (messages) => {
        setActiveChatMessages(messages)
    }
    const getActiveChat = () => {
        return activeChat
    }

    const openChatConnect = (chat) => {
        // get old messages
        // getChatMessages(chat)
        getChatInfo(chat.room_slug)

        const socket = new WebSocket(`ws://localhost:8000/ws/${chat.room_slug}?login=${userInfo.login}`);
        setSocket(socket);

        socket.onopen = (event) => {
            console.log("WebSocket connection opened:", event);
        };

        socket.onmessage = (event) => {
            let newMessageVar = JSON.parse(event.data);
            let messages = allMessages;
            if (newMessageVar.room_messages !== undefined) {
                for (let message of newMessageVar.room_messages) {
                    messages = [...messages,{
                        id:message.id,
                        message:message.message,
                        user: {
                            login: message.user.login
                        }
                    }]
                }
            } else {
                messages = [...messages,{
                    id:newMessageVar.message_id,
                    message:newMessageVar.message,
                    user: {
                        login: newMessageVar.login
                    }
                }]
            }
            console.log(newMessageVar.gpt)
            console.log(newMessageVar.login, userInfo.login)
            if (newMessageVar.gpt && newMessageVar.login===userInfo.login) {
                socket.send(JSON.stringify({
                    "method": "gpt",
                    "message": newMessageVar.message
                }))
            }
            updateMessages(messages)
            allMessages = messages


            if (newMessageVar.room_messages === undefined) {
                scrollToElement()
            }
        };

        socket.onerror = (error) => {
            console.log("WebSocket error:", error);
        };

        socket.onclose = (event) => {
            console.log("WebSocket connection closed:", event.code);
        };
    }

    const sendMessage = () => {
        socketO.send(JSON.stringify({
            "method": "post",
            "message": newMessage
        }))
        setNewMessage('')
    }

    const startChat = (chat) => {
        // Закрываем старое соединение если оно есть
        closeChatConnect()

        setActiveChat(chat);

        // start connect socket + getChatMessages
        openChatConnect(chat)
    }

    const startSearchedChat = (chat) => {
        setChatsSearchBool(false)
        setChatsSearch([])

        // Закрываем старое соединение если оно есть
        closeChatConnect()

        setActiveChat(chat);

        createChatRoom(chat).then(chat => {
            getMyChats()

            // start connect socket + getChatMessages
            openChatConnect(chat)
        })


    }

    const changeChatAutoresponder = () => {
        axios.patch('http://127.0.0.1:8000/api/chat/chat', {
            'room_slug':activeChat.room_slug
        }, {
            headers:{
                Authorization:`Token ${localStorage.getItem('token')}`
            }
        }).then((response)=>{
            console.log(response)
            if (response.status === 200) {
                let autoresponder_type = response.data.autoresponder_type
                setActiveChatAutoresponder(autoresponder_type)
            }
        }).catch((error)=>{
            if (error.response.status === 401) {
                localStorage.removeItem('token')
                navigate('/auth')
            }
        })
    }


    if (firstStart) {
        getMyInfo()
        getMyChats()
        setFirstStart(false)
    }

    return (
        <div className="App">
          <div className='chat-list'>
            <div className='setting-section d-flex align-items-center justify-content-between'>
              <div className='fs-4'>
                  Чаты
              </div>
              <Link to='settings'><img className='' src={require('./assets/images/free-icon-settings-126472.png')} alt="" title='Настройки' /></Link>
            </div>
            <div className='search-block w-100 d-flex align-items-center justify-content-center'>
                <input type="text" className='search-form' placeholder='Поиск' onChange={(event)=> {
                    searchChat(event.target.value)
                }}/>
            </div>
              {chatsSearchBool === false && chats.map((chat)=>{
                  return (
                      <div className='chat-block' key={chat.room_slug} onClick={()=>{startChat(chat)}}>
                          <div className='img-block'>
                              <div className='img'>
                                  {((chat.user_1.login === userInfo.login)?chat.user_2.login:chat.user_1.login)[0].toUpperCase()}
                              </div>
                          </div>
                          <div className="content">
                              <div className='title'>{(chat.user_1.login === userInfo.login)?chat.user_2.login:chat.user_1.login}</div>
                              <div className='last-message'>Последне выполненное задание следующее</div>
                          </div>
                      </div>
                  )
              })}
              {chatsSearchBool && chatsSearch.map((chat)=>{
                  return (
                      <div className='chat-block' key={chat.room_slug} onClick={()=>{startSearchedChat(chat)}}>
                          <div className='img-block'>
                              <div className='img'>
                                  {(chat.login)[0].toUpperCase()}
                              </div>
                          </div>
                          <div className="content">
                              <div className='title'>{chat.login}</div>
                              <div className='last-message'>Последне выполненное задание следующее</div>
                          </div>
                      </div>
                  )
              })}
          </div>
          <div className='chat'>
              {activeChat.room_slug === undefined &&
                  <div className='empty-chat'>
                      <span>Выберите, кому хотели бы написать</span>
                  </div>
              }

              {/* activeChat */}
              {activeChat.room_slug !== undefined &&
                  <div>
                      { messageContextMenuX !== 0 && messageContextMenuY !== 0 &&
                          <div className="context-menu" onContextMenu={(event)=>{event.preventDefault();setMessageContextMenuX(0); setMessageContextMenuY(0)}}
                               onClick={()=>{setMessageContextMenuX(0); setMessageContextMenuY(0)}}
                          >
                              <div className="menu" style={{top:messageContextMenuY+'px',left:messageContextMenuX+'px'}} onClick={(event)=>{event.stopPropagation()}}>
                                  <div className='action'>
                                      Удалить
                                  </div>
                              </div>
                          </div>
                      }
                  </div>
              }
              {activeChat.room_slug !== undefined &&
                  <div className='chat-section'>
                      <div className='chat-section-header'>
                          <div className='fs-4'>
                              Tasks
                          </div>
                      </div>
                      <div className="chat-section-message-list " ref={targetElementRef}>
                              { activeChatMessages.map((message, index)=>{
                                  let userLogin = message.user.login;
                                  let myLogin  = userInfo.login;

                                  let myMessage = false;
                                  let firstMessage = false;
                                  if (activeChatMessages.length < index+1) {
                                      if (activeChatMessages[index-1].user.login !== userLogin) {
                                          firstMessage = true;
                                      }

                                  }
                                  if (userLogin === myLogin) {
                                      myMessage = true
                                  }

                                  return (
                                      <div className={'block-message position-relative ' + (myMessage?'my-block-message':'friend-block-message')} key={message.id} id={'message'+message.id}>
                                          <div onContextMenu={(event)=>{myMessage?FSetMyMessageContextMenu(event):FSetMessageContextMenu(event)}} className={myMessage?'my-message':'friend-message'}>
                                              <span className='message'>{message.message}</span>
                                          </div>
                                      </div>
                                  )
                              })}

                          <div className='ref-block' ref={targetElementRefElem}></div>
                      </div>
                      <div className='chat-section-form'>
                          <input type="text" className='submit-form' placeholder='Написать сообщение...' onKeyDown={(event=>{if (event.key === 'Enter') {sendMessage()}})} value={newMessage} onChange={event => setNewMessage(event.target.value)}/>
                          <div className='buttons'>
                              {activeChatAutoresponder &&
                                  <input type="submit" className='btn btn-warning ms-4' onClick={()=>{changeChatAutoresponder()}} value="Выключить автоответчик"/>
                              }
                              {!activeChatAutoresponder &&
                                  <input type="submit" className='btn btn-primary ms-4' onClick={()=>{changeChatAutoresponder()}} value="Включить автоответчик"/>
                              }
                              <button className='btn btn-primary ms-4' onClick={sendMessage}>Отправить</button>
                              {/*<img title='Генерация картинок' className='generate-img' src={require('./assets/images/free-icon-images-square-outlined-interface-button-symbol-54975.png')} alt=""/>*/}
                              {/*<img title='Отправить сообщение' className='send-message' src={require('./assets/images/free-icon-send-3024593.png')} alt=""/>*/}
                          </div>
                      </div>
                  </div>
              }
          </div>
        </div>
    );
}

export default App;
