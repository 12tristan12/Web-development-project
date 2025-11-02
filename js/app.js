const LOCAL_PATH = './posts.json';
const ONLINE_ENDPOINT = 'https://api.npoint.io/90b72b9763737cea7f4b'; // kept (commented/fallback)

async function loadPosts() {
  try {
    
    const res = await fetch(LOCAL_PATH);
    if (!res.ok) throw new Error(`Local fetch failed: ${res.status}`);
    const data = await res.json();
    const posts = data.posts || [];
    renderPosts(posts);
  } catch (err) {
    console.error('Local fetch error:', err);

    const container = document.getElementById('posts-container');
    if (container) container.innerHTML = `<p style="color:red">Local fetch failed. Check server and network tab.</p>`;

    // Online fetch code
    /*
    try {
      const onlineRes = await fetch(ONLINE_ENDPOINT);
      if (!onlineRes.ok) throw new Error(`Online fetch failed: ${onlineRes.status}`);
      const onlineData = await onlineRes.json();
      renderPosts(onlineData.posts || []);
    } catch (onlineErr) {
      console.error('Online fetch fallback error:', onlineErr);
    }
    */
  }
}

function renderPosts(posts) {
  const container = document.getElementById('posts-container');
  if (!container) return;
  container.innerHTML = '';

  posts.forEach(post => {
    const article = document.createElement('article');
    article.className = 'post ' + (post.image_data ? 'post-with-photo' : 'post-without-photo');

    const header = document.createElement('div');
    header.className = 'post-header';

    const profileImg = document.createElement('img');
    profileImg.src = post.profile_image || 'img/me.png';
    profileImg.alt = post.author || 'User';
    profileImg.className = 'post-user-pic';

    const meta = document.createElement('div');
    meta.className = 'post-meta';
    const authorSpan = document.createElement('strong');
    authorSpan.textContent = post.author || '';
    const dateSpan = document.createElement('span');
    dateSpan.className = 'post-date';
    dateSpan.textContent = post.date || '';

    meta.appendChild(authorSpan);
    meta.appendChild(document.createTextNode(' • '));
    meta.appendChild(dateSpan);

    header.appendChild(profileImg);
    header.appendChild(meta);
    article.appendChild(header);

    if (post.image_data) {
      const photo = document.createElement('img');
      photo.src = post.image_data;
      photo.alt = post.text || '';
      photo.className = 'post-photo';
      article.appendChild(photo);
    }

    const content = document.createElement('div');
    content.className = 'post-content';
    const p = document.createElement('p');
    p.textContent = post.text || '';
    content.appendChild(p);
    article.appendChild(content);

    const likeBtn = document.createElement('button');
    likeBtn.className = 'like-button';
    likeBtn.textContent = '👍 Like';
    likeBtn.addEventListener('click', () => {
      likeBtn.classList.toggle('liked');
      likeBtn.textContent = likeBtn.classList.contains('liked') ? '💙 Liked' : '👍 Like';
    });

    article.appendChild(likeBtn);
    container.appendChild(article);
  });
}

document.addEventListener('DOMContentLoaded', loadPosts);