let totalClickedCount = 0;
let lastPageURL = "";

function clickFollowButtons(intervalMs) {
    function findByInnerText(parent, tagName, innerText) {
        return [...parent.querySelectorAll(tagName)].find(element => element.innerText.trim() === innerText);
    }

    function goToNextPage() {
        console.log("Intentando cambiar a la siguiente página...");
        const nextButton = document.querySelector('button[aria-label="Siguiente"]');
        if (nextButton) {
            nextButton.click();
            // Esperamos un poco después de hacer clic en "Siguiente" para asegurarnos de que la nueva página cargue
            setTimeout(() => {
                if (window.location.href !== lastPageURL) {
                    lastPageURL = window.location.href;
                    clickFollowButtons(intervalMs);  // Iniciar el proceso nuevamente en la nueva página
                }
            }, 5000);  // Espera de 5 segundos, ajustable según necesidad
        } else {
            console.error("No se encontró el botón 'Siguiente'.");
        }
    }

    const connectButtons = [...document.querySelectorAll('button')].filter(btn => btn.innerText === 'Conectar' && !btn.hidden);
    console.log(`Encontrados ${connectButtons.length} botones 'Conectar'.`);

    if (connectButtons.length === 0 || totalClickedCount >= 100) {
        console.log("Cambiando a la siguiente página...");
        goToNextPage();
        return;
    }

    function clickButton(index) {
        if (index >= connectButtons.length) {
            console.log("Todos los botones 'Conectar' han sido presionados. Cambiando a la siguiente página...");
            goToNextPage();
            return;
        }

        connectButtons[index].click();
        totalClickedCount++;

        setTimeout(() => {
            const modal = document.querySelector('[data-test-modal-id="send-invite-modal"]');
            const sendButton = findByInnerText(modal, 'button', 'Enviar');
            if (sendButton) {
                sendButton.click();
            }
            setTimeout(() => clickButton(index + 1), intervalMs);
        }, 2000);
    }

    clickButton(0);
}

// Iniciar el script
clickFollowButtons(1000);
