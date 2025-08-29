import React, { useEffect, useState } from 'react';
import './Playvideo.css';
import like from '../../assets/like.png';
import dislike from '../../assets/dislike.png';
import share from '../../assets/share.png';
import save from '../../assets/save.png';
// import jack from '../../assets/jack.png';
// import user_profile from '../../assets/user_profile.jpg';
import { API_KEY, value_converter } from '../../Data';
import moment from 'moment';
import { useParams } from 'react-router-dom';

const PlayVideo = () => {
    const {videoId} = useParams();
    const [apiData, setApiData] = useState(null);
    const [comments, setComments] = useState([]);
    const [channelData, setChannelData] = useState(null);

    const fetchVideoData = async () => {
        const videoDetailsUrl = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`;
        const response = await fetch(videoDetailsUrl);
        const data = await response.json();
        setApiData(data.items[0]);
    };


    const fetchOtherData = async () =>{
        const channelData_url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData.snippet.channelId}&key=${API_KEY}`;
        await fetch(channelData_url).then(res=>res.json()).then(data=>setChannelData(data.items[0]))
    }

    const fetchComments = async () => {
        const commentsUrl = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${API_KEY}`;
        const response = await fetch(commentsUrl);
        const data = await response.json();
        setComments(data.items || []);
    };

    useEffect(() => {
        fetchVideoData();
        fetchComments();
    }, [videoId]);

    useEffect(()=>{
        fetchOtherData();
    },[apiData])

    return (
        <div className="play-video">
            <iframe 
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}  
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen
            ></iframe>
            
            <h3>{apiData ? apiData.snippet.title : "Title Here"}</h3>
            
            <div className="play-video-info">
                <p>
                    {apiData ? value_converter(apiData.statistics.viewCount) : "16k"} &bull; 
                    {apiData ? moment(apiData.snippet.publishedAt).fromNow() : ""}
                </p>
                <div>
                    <span><img src={like} alt="Like" />{value_converter(apiData ? apiData.statistics.likeCount : 155)}</span>
                    <span><img src={dislike} alt="Dislike" /></span>
                    <span><img src={share} alt="Share" />Share</span>
                    <span><img src={save} alt="Save" />Save</span>
                </div>
            </div>
            <hr />
            
            <div className="publisher">
                <img src={channelData?channelData.snippet.thumbnails.default.url:""} alt="Publisher" />
                <div className='subscribers'>
                    <p>{apiData ? apiData.snippet.channelTitle : "Channel Name"}</p>
                    <span>{value_converter(channelData?channelData.statistics.subscriberCount:"1M")} Subscribers</span>
                </div>
                <button>Subscribe</button>
            </div>

            <div className="vid-description">
                <p>{apiData ? apiData.snippet.description.slice(0, 250) : "Description Here"}</p>
                <hr />
                <h4>{value_converter(apiData ? apiData.statistics.commentCount : 102)} Comments</h4>
                
                {comments.length > 0 ? (
                    comments.map(comment => (
                        <div className="comments" key={comment.id}>
                            <img src={comment.snippet.topLevelComment.snippet.authorProfileImageUrl} alt="User" />
                            <div>
                                <h3>
                                    {comment.snippet.topLevelComment.snippet.authorDisplayName} 
                                    <span> {moment(comment.snippet.topLevelComment.snippet.publishedAt).fromNow()}</span>
                                </h3>
                                <p>{comment.snippet.topLevelComment.snippet.textDisplay}</p>
                                <div className="comment-action">
                                    <img src={like} alt="Like" />
                                    <span>{value_converter(comment.snippet.topLevelComment.snippet.likeCount)}</span>
                                    <img src={dislike} alt="Dislike" />
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No comments available</p>
                )}
            </div>
        </div>
    );
};

export default PlayVideo;
