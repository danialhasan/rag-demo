import axios from 'axios';

let knowledgeBase = [];

const fetchCatFacts = () => axios.get('https://cat-fact.herokuapp.com/facts');
// const fetchBoredActivity = () => axios.get('https://www.boredapi.com/api/activity');
const fetchChuckNorrisJoke = () => axios.get('https://api.chucknorris.io/jokes/random');

const transformKnowledgeData = (catFacts) => {
return  [
    ...catFacts.data.map(fact => ({ type: 'cat', content: fact.text })),
  ];
};

const updateKnowledgeBase = async () => {
  try {
    console.log("Updating knowledge base")
    // return;
        const [catFacts, boredActivity, chuckNorrisJoke] = await Promise.all([
            fetchCatFacts(),
            // fetchBoredActivity(),
            fetchChuckNorrisJoke()
        ]);
    console.log(catFacts.data)
    // return
    knowledgeBase = transformKnowledgeData(catFacts);
console.log('',knowledgeBase)
    } catch (error) {
        console.error('Error updating knowledge base:', error);
    }
};

const matchKeywords = (content, keywords) => 
    keywords.some(keyword => content.toLowerCase().includes(keyword));

const getRelevantContext = (query) => {
    const keywords = query.toLowerCase().split(' ');
    const relevantItems = knowledgeBase.filter(item => 
        matchKeywords(item.content, keywords)
    );

    return relevantItems.map(item => item.content).join(' ');
};

// Update knowledge base every 30 minutes
setInterval(updateKnowledgeBase, 30 * 60 * 1000);
// Initial update
updateKnowledgeBase();

export { getRelevantContext }; 