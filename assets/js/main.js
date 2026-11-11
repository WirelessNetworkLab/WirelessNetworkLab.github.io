document.addEventListener('DOMContentLoaded', () => {
      
      /* ================= 1. モバイルナビゲーション開閉制御 ================= */
      const mobileMenuBtn = document.getElementById('mobile-menu-btn');
      const mobileMenu = document.getElementById('mobile-menu');
      const iconOpen = document.getElementById('menu-icon-open');
      const iconClose = document.getElementById('menu-icon-close');

      if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
          const isOpen = !mobileMenu.classList.contains('hidden');
          if (isOpen) {
            mobileMenu.classList.add('hidden');
            iconOpen.classList.remove('hidden');
            iconClose.classList.add('hidden');
          } else {
            mobileMenu.classList.remove('hidden');
            iconOpen.classList.add('hidden');
            iconClose.classList.remove('hidden');
          }
        });
      }


      /* ================= 2. ワイヤレスネットワーク Canvas アニメーション ================= */
      const canvas = document.getElementById('network-canvas');
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      let width, height;
      let nodes = [];
      let packets = [];

      // ノードの数と接続距離の設定
      const nodeCount = 45;
      const connectionDistance = 140;

      // リサイズ処理
      function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        width = canvas.width = rect.width;
        height = canvas.height = rect.height;
      }

      // ノードクラス
      class Node {
        constructor() {
          this.x = Math.random() * width;
          this.y = Math.random() * height;
          this.vx = (Math.random() - 0.5) * 0.8;
          this.vy = (Math.random() - 0.5) * 0.8;
          this.radius = Math.random() * 2 + 2;
        }

        update() {
          this.x += this.vx;
          this.y += this.vy;

          if (this.x < 0 || this.x > width) this.vx *= -1;
          if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fillStyle = '#10b981';
          ctx.fill();
        }
      }

      // パケット（ノード間を飛ぶ光の点）クラス
      class Packet {
        constructor(startNode, endNode) {
          this.startNode = startNode;
          this.endNode = endNode;
          this.progress = 0;
          this.speed = 0.02 + Math.random() * 0.02;
        }

        update() {
          this.progress += this.speed;
        }

        draw() {
          const currentX = this.startNode.x + (this.endNode.x - this.startNode.x) * this.progress;
          const currentY = this.startNode.y + (this.endNode.y - this.startNode.y) * this.progress;

          ctx.beginPath();
          ctx.arc(currentX, currentY, 3, 0, Math.PI * 2);
          ctx.fillStyle = '#059669';
          ctx.shadowColor = '#10b981';
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0; // リセット
        }
      }

      // 初期化
      function init() {
        resize();
        nodes = [];
        for (let i = 0; i < nodeCount; i++) {
          nodes.push(new Node());
        }
      }

      // アニメーションループ
      function animate() {
        ctx.clearRect(0, 0, width, height);

        // ノードの更新と描画
        for (let i = 0; i < nodes.length; i++) {
          nodes[i].update();
          nodes[i].draw();

          // ノード間の接続ライン
          for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < connectionDistance) {
              const alpha = (1 - dist / connectionDistance) * 0.25;
              ctx.beginPath();
              ctx.moveTo(nodes[i].x, nodes[i].y);
              ctx.lineTo(nodes[j].x, nodes[j].y);
              ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`;
              ctx.lineWidth = 1;
              ctx.stroke();

              // 低い確率でパケットを発生
              if (Math.random() < 0.0008) {
                packets.push(new Packet(nodes[i], nodes[j]));
              }
            }
          }
        }

        // パケットの更新と描画
        for (let i = packets.length - 1; i >= 0; i--) {
          const p = packets[i];
          p.update();
          p.draw();
          if (p.progress >= 1) {
            packets.splice(i, 1);
          }
        }

        requestAnimationFrame(animate);
      }

      window.addEventListener('resize', resize);
      init();
      animate();

    });