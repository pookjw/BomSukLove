//
//  ViewController.swift
//  BomSukLove
//
//  Created by Jinwoo Kim on 9/22/21.
//

import UIKit

final class ViewController: UIViewController {
    private var stackView: UIStackView!
    private var imageView: UIImageView!
    private var label: UILabel!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setAttributes()
        configureStackView()
        configureImageView()
        configureLabel()
    }
    
    private func setAttributes() {
        view.backgroundColor = .systemBackground
    }
    
    private func configureStackView() {
        let stackView: UIStackView = .init()
        self.stackView = stackView
        
        stackView.axis = .vertical
        stackView.translatesAutoresizingMaskIntoConstraints = false
        
        view.addSubview(stackView)
        NSLayoutConstraint.activate([
            stackView.leadingAnchor.constraint(equalTo: view.layoutMarginsGuide.leadingAnchor),
            stackView.trailingAnchor.constraint(equalTo: view.layoutMarginsGuide.trailingAnchor),
            stackView.centerYAnchor.constraint(equalTo: view.layoutMarginsGuide.centerYAnchor)
        ])
    }
    
    private func configureImageView() {
        let imageView: UIImageView = .init(image: UIImage(named: "example"))
        self.imageView = imageView
        
        imageView.backgroundColor = .clear
        imageView.contentMode = .scaleAspectFit
        
        stackView.addArrangedSubview(imageView)
    }
    
    private func configureLabel() {
        let label: UILabel = .init()
        self.label = label
        
        label.backgroundColor = .clear
        label.numberOfLines = 0
        label.text = NSLocalizedString("DESCRIPTION", comment: "")
        
        stackView.addArrangedSubview(label)
    }
}
