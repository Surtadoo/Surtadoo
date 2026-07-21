// Handles all modal-related functionality
export class ModalManager {
    constructor(gameHub) {
        this.gameHub = gameHub;
    }

    showGameModal(game) {
        const modal = document.getElementById('gameModal');
        const modalImage = document.getElementById('modalImage');
        const modalTitle = document.getElementById('modalTitle');
        const modalCategory = document.getElementById('modalCategory');
        const modalPlatform = document.getElementById('modalPlatform');
        const modalDescription = document.getElementById('modalDescription');
        const modalDownloadBtn = document.getElementById('modalDownloadBtn');

        modalImage.src = game.image;
        modalImage.alt = game.title;
        modalTitle.textContent = game.title;
        modalCategory.textContent = game.category;
        modalPlatform.textContent = game.platform;
        modalDescription.textContent = game.description;
        modalDownloadBtn.href = game.url;

        // Add error handling for modal image
        modalImage.onerror = function() {
            this.src = 'https://via.placeholder.com/600x350/1a1a1a/ff6b35?text=Game+Hub';
            this.onerror = null;
        };

        modal.classList.add('active');
    }

    showParcerias() {
        // Close mobile menu if open
        const mobileMenu = document.getElementById('mobileMenu');
        mobileMenu.classList.remove('active');

        // Remove existing modal if any
        const existingModal = document.getElementById('parceriasModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Create modal HTML
        const modalHTML = `
            <div class="modal-overlay active" id="parceriasModal">
                <div class="modal-content" style="max-width: 500px;">
                    <button class="modal-close" onclick="document.getElementById('parceriasModal').remove()">&times;</button>
                    <div class="modal-info">
                        <h2 class="modal-title" style="text-align: center; margin-bottom: 30px;">Nossas Parcerias</h2>

                        <div class="parceria-item">
                            <img src="https://via.placeholder.com/100x100/ff6b35/ffffff?text=JD" alt="JD Games" class="parceria-avatar">
                            <div class="parceria-info">
                                <h3>JD Games</h3>
                                <p>Especialista em jogos retrô e clássicos</p>
                                <a href="https://wa.me/5521980204832" class="modal-download-btn" style="margin-top: 10px;" target="_blank">
                                    Contato
                                </a>
                            </div>
                        </div>

                        <div class="parceria-item">
                            <img src="https://via.placeholder.com/100x100/ff6b35/ffffff?text=RG" alt="RetroGamer" class="parceria-avatar">
                            <div class="parceria-info">
                                <h3>RetroGamer Brasil</h3>
                                <p>Colecionador e restaurador de consoles</p>
                                <a href="https://wa.me/5521980204832" class="modal-download-btn" style="margin-top: 10px;" target="_blank">
                                    Contato
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Add click outside to close
        const modal = document.getElementById('parceriasModal');
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    showDoacoes() {
        // Close mobile menu if open
        const mobileMenu = document.getElementById('mobileMenu');
        mobileMenu.classList.remove('active');

        // Remove existing modal if any
        const existingModal = document.getElementById('doacoesModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Chave PIX (exemplo - substitua com sua chave real)
        const chavePix = '5521980204832';
        const chaveCopiaCola = '00020126580014BR.GOV.BCB.PIX0136d1ae33f7-338b-4099-aedf-b19c89258f5f5204000053039865802BR5913Yago da Silva6009SAO PAULO62140510gSCP66RZet63046C40';

        // Create modal HTML - increased width and height
        const modalHTML = `
            <div class="modal-overlay active" id="doacoesModal">
                <div class="modal-content" style="max-width: 600px; max-height: 90vh; overflow: hidden;">
                    <button class="modal-close" onclick="document.getElementById('doacoesModal').remove()">&times;</button>
                    <div class="modal-info" style="max-height: calc(90vh - 60px); overflow-y: auto; padding-right: 15px; padding-left: 15px;">
                        <h2 class="modal-title" style="text-align: center; margin-bottom: 20px;">Ajude o GameHub!</h2>

                        <p style="text-align: center; color: var(--text-gray); margin-bottom: 30px; line-height: 1.6;">
                            Ajude-nos a manter o site no ar e trazer mais jogos incríveis para você! 
                            Sua doação, mesmo que pequena, faz toda a diferença.
                        </p>

                        <div style="text-align: center; margin-bottom: 20px;">
                            <img src="https://cdn.discordapp.com/attachments/1223409328229187656/1422044521734340629/frame.png?ex=68db3daa&is=68d9ec2a&hm=16471cddafcd6f5076b7d8e0c003ca9a952773ddb3fc7fbe84d6c3b5f5dca365&" alt="QR Code PIX" style="width: 250px; height: 250px; border-radius: 10px; border: 2px solid var(--primary-orange);">
                        </div>

                        <div style="text-align: center; margin-bottom: 20px;">
                            <h3 class="nome-surtado"><span style="color: var(--primary-orange);">NOME</span> <span style="color: #4CAF50;">SURTADO</span></h3>
                            <p class="banco-name" style="font-size: 0.9rem; margin-bottom: 15px;"><span style="color: var(--primary-orange);">Banco</span> <span style="color: #9C27B0;">Nubank</span></p>

                            <div class="chave-pix-info">
                                <p class="chave-label"><span style="color: var(--primary-orange);">Chave</span> <span style="color: var(--primary-orange);">PIX</span>:</p>
                                <p class="chave-value">${chavePix}</p>
                            </div>
                        </div>

                        <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                            <button class="modal-download-btn" style="flex: 1; text-align: center;" onclick="window.gameHub.copiarChave('${chavePix}')">
                                Copiar Chave
                            </button>
                            <button class="modal-download-btn" style="flex: 1; text-align: center;" onclick="window.gameHub.copiarChave('${chaveCopiaCola}')">
                                Copiar Código
                            </button>
                        </div>

                        <p style="text-align: center; color: var(--text-gray); font-size: 0.8rem; line-height: 1.4;">
                            Muito obrigado pelo seu apoio! ❤️<br>
                            Cada doação nos motiva a continuar trazendo os melhores jogos para você!
                        </p>
                    </div>
                </div>
            </div>
        `;

        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Add click outside to close
        const modal = document.getElementById('doacoesModal');
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    copiarChave(texto) {
        navigator.clipboard.writeText(texto).then(() => {
            // Create a small notification
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--primary-orange);
                color: var(--primary-black);
                padding: 10px 20px;
                border-radius: 5px;
                font-weight: 600;
                z-index: 3000;
                animation: slideIn 0.3s ease;
            `;
            notification.textContent = 'Copiado para área de transferência!';
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.remove();
            }, 2000);
        }).catch(err => {
            console.error('Erro ao copiar:', err);
            alert('Erro ao copiar. Por favor, copie manualmente.');
        });
    }
}