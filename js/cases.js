const caseNodes = Array.from(document.querySelectorAll(".case-node"));
const panelAmount = document.querySelector(".cases-panel-amount");
const panelType = document.querySelector(".cases-panel-type");

if (caseNodes.length && panelAmount && panelType) {
  caseNodes.forEach((node) => {
    node.addEventListener("mouseenter", () => {
      const amount = node.dataset.amount;
      const type = node.dataset.type;
      panelAmount.textContent = `$${amount}M`;
      panelType.textContent = type;
      caseNodes.forEach((n) => n.classList.remove("case-node--focus"));
      node.classList.add("case-node--focus");
    });
  });
}
