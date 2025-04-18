let skip = 50;
let loading = false;

window.addEventListener('scroll', async () => {
  if (loading) return;

  const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;
  if (nearBottom) {
    loading = true;
    try {
      const res = await fetch(`/dashboard?skip=${skip}`, {
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
      });
      const newQuestions = await res.json();

      newQuestions.forEach(q => {
        const card = document.createElement('a');
        card.className = 'card';
        card.href = `/question/${q.QID}`;
        card.innerHTML = `
          <h4>${q.Topic}</h4>
          <p>${q.Question}</p>
          <div class="ext-details">
            <p>Answers: ${q.answerCount}</p>
            <p>Saved: ${q.Saved.length}</p>
          </div>
        `;
        document.querySelector('.questions').appendChild(card);
      });

      skip += newQuestions.length;
    } catch (err) {
      console.error('Error loading more questions:', err);
    }
    loading = false;
  }
});