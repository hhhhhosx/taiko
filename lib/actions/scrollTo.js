const runtimeHandler = require('../handlers/runtimeHandler');

const scrollToElement = async (element) => {
  function scrollToNode() {
    const element = this.nodeType === Node.TEXT_NODE ? this.parentElement : this;
    element.scrollIntoView({ block: 'center', inline: 'center' });
    return 'result';
  }
  await runtimeHandler.runtimeCallFunctionOn(scrollToNode, null, { objectId: element.get() });
};

module.exports = { scrollToElement };
